using Microsoft.WindowsAzure.Storage.Table;
using SJKP.OutlookAppoinmentPlannerBackend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SJKP.OutlookAppointmentPlannerWeb.Models
{
    public class AttendeeRepository : TableRepository<Attendee>
    {
        public AttendeeRepository() : base("attendees")
        {

        }

        public TableData<Attendee> GetFirstOrDefault(string scheduleId, string attendeeId)
        {
            TableQuery<TableData<Attendee>> query = new TableQuery<TableData<Attendee>>().Where(
               TableQuery.CombineFilters(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, scheduleId),
               TableOperators.And, TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, attendeeId)));
            return table.ExecuteQuery(query).FirstOrDefault();
        }

        public IEnumerable<Attendee> GetAllFormSchedule(string scheduleId)
        {
            TableQuery<TableData<Attendee>> query = new TableQuery<TableData<Attendee>>().Where(
               TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, scheduleId));
            return table.ExecuteQuery(query).Select(s => s.Entity);
        }
    }
}
