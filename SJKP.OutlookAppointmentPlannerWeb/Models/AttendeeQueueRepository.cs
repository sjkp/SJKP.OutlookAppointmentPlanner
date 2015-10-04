using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SJKP.OutlookAppointmentPlannerWeb.Models
{
    public class AttendeeQueueRepository : QueueRepository<Attendee>
    {
        public AttendeeQueueRepository() : base("attendeeaccepted")
        {
        }
        
    }
}
