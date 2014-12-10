using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SJKP.OutlookAppoinmentPlannerBackend.Models
{
    public class ScheduledAppointment : IId
    {
        public IEnumerable<ScheduledDate> Dates { get; set; }
        public Guid? Id { get; set; }
    }

    public class ScheduledDate
    {
        public DateTime Date { get; set; }
        public Guid? Id { get;set;}
        public IEnumerable<ScheduledTimeslot> Timeslots { get; set; }
    }

    public class ScheduledTimeslot 
    {
        public Guid? Id {get;set;}
        public string Time {get;set;}
        public bool Selected { get; set; }
    }
    
    
}