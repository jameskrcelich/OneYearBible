using OneYearBible.Models;
using System;
using System.IO;
using System.Linq;
using OneYearBible;
using Microsoft.AspNetCore.Html;
using Microsoft.JSInterop;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace OneYearBible;

public class BibleReadingsRepository : IBibleReadingsRepository
{
    private readonly BibleReadings repo;
    private readonly IWebHostEnvironment env;
    static  readonly HttpClient    client = new HttpClient();
    public string WebRoot { get; set; }
    
    public BibleReadingsRepository()
    {
        repo = new BibleReadings();
    }

    private static readonly string[] MonthFilePrefix =
    {
        "", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    };

    public async Task<BibleReadings> GetAllBibleReadings(DateOnly date)
    {
        // get the day of the current year
        string monthPrefix = MonthFilePrefix[date.Month];

        // The "month" text files contain all the readings for each day/month
        string fileLoc = Path.Combine(WebRoot, $"{monthPrefix}Verses.txt");
        string line    = File.ReadLines(fileLoc).ElementAtOrDefault(date.Day - 1);

        // Delimiter is semicolon
        string[] readings = line.Split(';');

        repo.monthDay = readings[0];
        
        Console.WriteLine("hitting biblereadings");
        
        // Get rid of the + signs the server requires so they don't print to the user later on
        repo.OldTestamentVerses = readings[1].Replace('+', ' ');
        repo.NewTestamentVerses = readings[2].Replace('+', ' ');
        repo.PsalmVerses   = readings[3].Replace('+', ' ');
        repo.ProverbVerses = readings[4].Replace('+', ' ');
       
        for (var i = 1; i <= 4; i++)
        {
            // comment that follows shows a fetch crossing books... one of the hardest examples,
            // which is slightly different (+ before the 2nd book) than the other calls:
            //
            // string url = $"https://labs.bible.org/api/?passage=Gen+50:1-26+Exo:1:1-2:10";
                
            /* Example from file: Deuteronomy+28:1-68;Luke+11:14-36;Psalm+77:1-20;Proverbs+12:18
             * full formatting means the server sends back the text with all the html formatting.
             */
            string url = $"https://labs.bible.org/api/?passage={readings[i]}&formatting=full";
            //string url = $"https://labs.bible.org/api/?passage={readings[1]};{readings[2]}&formatting=full";
                
            try
            {
                // Await the response from bible.org server
                string bibleApiResponse = await client.GetStringAsync(url);
                    
                // Console.WriteLine(bibleApiResponse); for debugging purposes
                
                repo.ApiText[i-1] = bibleApiResponse;
            }
            catch (HttpRequestException e)
            {
                Console.WriteLine($"Error fetching [{url}]: {e.Message}");
            }
        }
        return repo;
        
    } // End - GetAllBibleReadings()
    
} // End - BibleReadingsRepository class