using SJKP.OutlookAppoinmentPlannerBackend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SJKP.OutlookAppointmentPlannerWeb.Models
{
    public class ScheduleRepository : TableRepository<ScheduledAppointment>
    {
        public ScheduleRepository() : base("schedules")
        {

        }
    }
}
