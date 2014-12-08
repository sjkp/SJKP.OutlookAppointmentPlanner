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

        // GET: api/Schedule
        public IEnumerable<Attendee> Get()
        {
            return SelectMany();
        }

        // GET: api/Attendee/5
        public HttpResponseMessage Get(Guid scheduleId)
        {
            var entity = GetFirstOrDefault(scheduleId);
            if (entity == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
            return Request.CreateResponse(entity.Entity);
        }

        // POST: api/Attendee
        public async Task<Guid> Post([FromBody]Attendee value)
        {
            value.Id = Guid.NewGuid();
            foreach (var s in value.SeletedDates)
            {
                s.Id = Guid.NewGuid();
                foreach (var t in s.Timeslots)
                {
                    t.Id = Guid.NewGuid();
                }
            }

            await table.ExecuteAsync(Microsoft.WindowsAzure.Storage.Table.TableOperation.Insert(new TableData<Attendee>(value)));

            return value.Id.Value;
        }

        // PUT: api/Attendee/5
        public async Task<HttpResponseMessage> Put(Guid scheduleId, [FromBody]Attendee value)
        {
            var existing = GetFirstOrDefault(scheduleId);
            if (existing == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
            existing.Data = new TableData<Attendee>(value).Data;
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
