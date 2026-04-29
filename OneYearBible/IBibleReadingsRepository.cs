using System.Collections.Generic;
using OneYearBible.Models;

namespace OneYearBible;

public interface IBibleReadingsRepository
{
    public Task<BibleReadings> GetAllBibleReadings(DateOnly date);
}