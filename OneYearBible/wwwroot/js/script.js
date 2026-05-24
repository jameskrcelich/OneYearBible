let nav= 0;
let clicked= null;

const calendar = document.getElementById('calendar');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const newEventModal = document.getElementById('newEventModal');
const backDrop = document.getElementById('modalBackDrop');

function openModal(date) 
{
    clicked = date;

    const [month, day, year] = date.split('/');
    const apiDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    
    document.getElementById('modalDate').innerText = '';
    document.getElementById('otRef').innerText = '';
    document.getElementById('otText').innerHTML = '';
    document.getElementById('ntRef').innerText = '';
    document.getElementById('ntText').innerHTML = '';
    document.getElementById('psalmRef').innerText = '';
    document.getElementById('psalmText').innerHTML = '';
    document.getElementById('proverbRef').innerText = '';
    document.getElementById('proverbText').innerHTML = '';
    document.getElementById('modalLoading').style.display = 'block';
    
    backDrop.style.display = 'block';
    newEventModal.style.display = 'block';
    
    fetch(`/Home/GetReadings?date=${apiDate}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('modalLoading').style.display = 'none';
            document.getElementById('modalDate').innerText = data.monthDay;
            document.getElementById('otRef').innerText = data.oldTestamentVerses;
            document.getElementById('otText').innerHTML = data.apiText[0];
            document.getElementById('ntRef').innerText = data.newTestamentVerses;
            document.getElementById('ntText').innerHTML = data.apiText[1];
            document.getElementById('psalmRef').innerText = data.psalmVerses;
            document.getElementById('psalmText').innerHTML = data.apiText[2];
            document.getElementById('proverbRef').innerText = data.proverbVerses;
            document.getElementById('proverbText').innerHTML = data.apiText[3];
          
    })
    .catch(() => {
        document.getElementById('modalLoading').innerText = 'failed to load readings';
    })
        
} // End - openModal()

function load() 
{
    const dt = new Date();

    if (nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav);
    }

    const day   = dt.getDate();
    const month = dt.getMonth();
    const year  = dt.getFullYear();

    const firstDayOfMonth= new Date(year, month, 1);
    const daysInMonth  = new Date(year, month + 1, 0).getDate();
  
    const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
            weekday: 'long',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
    });
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

    document.getElementById('monthDisplay').innerText = 
            `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

    calendar.innerHTML = '';

    for(let i = 1; i <= paddingDays + daysInMonth; i++) 
    {
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        const dayString = `${month + 1}/${i - paddingDays}/${year}`;

        if (i > paddingDays) 
        {
            daySquare.innerText = i - paddingDays;
            
            if (i - paddingDays === day && nav === 0) {
                daySquare.id = 'currentDay';
            }

            /* User has clicked a valid day (not a padding day), so call openModal()
             * to process the day clicked to display the daily scriptures
             */
            daySquare.addEventListener('click', () => openModal(dayString));
        } 
        else 
        {
            daySquare.classList.add('padding');
        }
        calendar.appendChild(daySquare);    
    
    } // for loop
        
} // End - load()

function closeModal() 
{
    newEventModal.style.display = 'none';
    backDrop.style.display = 'none';
    clicked = null;
    
    load();
    
} // End - closeModal()

function initButtons() 
{
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++;
        load();
    });

    document.getElementById('backButton').addEventListener('click', () => {
        nav--;
        load();
    });

    document.getElementById('closeButton').addEventListener('click', closeModal);
}

initButtons();
load();