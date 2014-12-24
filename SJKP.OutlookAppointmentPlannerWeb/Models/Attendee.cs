using SJKP.OutlookAppoinmentPlannerBackend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SJKP.OutlookAppointmentPlannerWeb.Models
{
    public class Attendee : IId
    {
        public string ScheduleId { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }

        public string Email { get; set; }

        public IEnumerable<ScheduledDate> SelectedDates { get; set; }

        public string CreatedBy
        {
            get
            {
                return Email;
            }
            set
            {
                Email = value;
            }
        }
    }
}