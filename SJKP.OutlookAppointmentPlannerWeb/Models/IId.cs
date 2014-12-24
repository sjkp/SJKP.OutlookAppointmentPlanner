using System;
namespace SJKP.OutlookAppoinmentPlannerBackend.Models
{
    public interface IId
    {
        string Id { get; set; }

        string CreatedBy { get; set; }
    }
}
