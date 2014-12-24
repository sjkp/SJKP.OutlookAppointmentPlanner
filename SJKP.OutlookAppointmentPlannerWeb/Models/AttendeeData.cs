using SJKP.OutlookAppoinmentPlannerBackend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SJKP.OutlookAppointmentPlannerWeb.Models
{
    public class AttendeeData : TableData<Attendee>
    {
        public AttendeeData(Attendee data) : base(data)
        {

        }
        protected override string GetPartitionKey(Attendee data)
        {
            return data.ScheduleId;
        }
    }
}