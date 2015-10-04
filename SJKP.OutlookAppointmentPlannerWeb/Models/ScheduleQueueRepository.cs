using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SJKP.OutlookAppoinmentPlannerBackend.Models;

namespace SJKP.OutlookAppointmentPlannerWeb.Models
{
    public class ScheduleQueueRepository : QueueRepository<ScheduledAppointment>
    {
        public ScheduleQueueRepository() : base("appointmentcreated")
        {

        }
    }
}
