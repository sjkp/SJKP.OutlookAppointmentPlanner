using SJKP.OutlookAppoinmentPlannerBackend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SJKP.OutlookAppointmentPlannerWeb.Models
{
    public class Attendee : IId
    {
        public Guid? ScheduleId { get; set; }
        public Guid? Id { get; set; }
        public string Name { get; set; }

        public string Email { get; set; }

        public IEnumerable<ScheduledDate> SelectedDates { get; set; }
    }
}