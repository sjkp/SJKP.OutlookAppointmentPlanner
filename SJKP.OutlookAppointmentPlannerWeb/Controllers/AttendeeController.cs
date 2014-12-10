using Microsoft.WindowsAzure.Storage.Table;
using SJKP.OutlookAppoinmentPlannerBackend.Controllers;
using SJKP.OutlookAppoinmentPlannerBackend.Models;
using SJKP.OutlookAppointmentPlannerWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace SJKP.OutlookAppointmentPlannerWeb.Controllers
{
    public class AttendeeController : TableController<Attendee>
    {
        public AttendeeController()
            : base("attendees")
        {

        }

        protected TableData<Attendee> GetFirstOrDefault(Guid scheduleId, Guid attendeeId)
        {
            TableQuery<TableData<Attendee>> query = new TableQuery<TableData<Attendee>>().Where(
               TableQuery.CombineFilters(TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, scheduleId.ToString()),
               TableOperators.And, TableQuery.GenerateFilterCondition("RowKey", QueryComparisons.Equal, attendeeId.ToString())));
            return table.ExecuteQuery(query).FirstOrDefault();
        }

        protected IEnumerable<Attendee> GetAllFormSchedule(Guid scheduleId)
        {
            TableQuery<TableData<Attendee>> query = new TableQuery<TableData<Attendee>>().Where(
               TableQuery.GenerateFilterCondition("PartitionKey", QueryComparisons.Equal, scheduleId.ToString()));
            return table.ExecuteQuery(query).Select(s => s.Entity);
        }

        // GET: api/Schedule
        public IEnumerable<Attendee> Get()
        {
            throw new NotImplementedException();
        }


        [Route("api/schedule/{scheduleId}/attendees")]
        [HttpGet]
        public HttpResponseMessage Get(Guid scheduleId)
        {            
            return Request.CreateResponse(GetAllFormSchedule(scheduleId));
        }

        // POST: api/Attendee
        public async Task<Guid> Post([FromBody]Attendee value)
        {
            value.Id = Guid.NewGuid();            
            foreach (var s in value.SelectedDates)
            {
                s.Id = Guid.NewGuid();
                foreach (var t in s.Timeslots)
                {
                    t.Id = Guid.NewGuid();
                }
            }

            await table.ExecuteAsync(Microsoft.WindowsAzure.Storage.Table.TableOperation.Insert(new AttendeeData(value)));

            return value.Id.Value;
        }

        // PUT: api/Attendee/5
        public async Task<HttpResponseMessage> Put(Guid id, [FromBody]Attendee value)
        {            
            var existing = GetFirstOrDefault(value.ScheduleId.Value, id);
            if (existing == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
            existing.Data = new AttendeeData(value).Data;
            TableOperation operation = Microsoft.WindowsAzure.Storage.Table.TableOperation.Replace(existing);

            var response = await table.ExecuteAsync(operation);
            return Request.CreateResponse(response.HttpStatusCode);
        }

        // DELETE: api/Schedule/5
        public override async Task Delete(Guid id)
        {
            await base.Delete(id);
        }
    }
}
