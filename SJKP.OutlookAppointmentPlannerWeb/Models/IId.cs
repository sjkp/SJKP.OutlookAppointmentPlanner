using System;
namespace SJKP.OutlookAppoinmentPlannerBackend.Models
{
    public interface IId
    {
        Guid? Id { get; set; }

        string CreatedBy { get; set; }
    }
}
