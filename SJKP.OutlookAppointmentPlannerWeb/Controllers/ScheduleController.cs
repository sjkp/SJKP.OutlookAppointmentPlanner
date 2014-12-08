using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using SJKP.OutlookAppoinmentPlannerBackend.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace SJKP.OutlookAppoinmentPlannerBackend.Controllers
{
    public class ScheduleController : TableController<ScheduledAppointment>
    {
        
        public ScheduleController() : base("schedules")
        {
            
        }
        // GET: api/Schedule
        public IEnumerable<ScheduledAppointment> Get()
        {
            return SelectMany();
        }

        // GET: api/Schedule/5
        public HttpResponseMessage Get(Guid id)
        {
            var entity = GetFirstOrDefault(id);
            if (entity == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
            return Request.CreateResponse(entity.Entity);
        }

        

        // POST: api/Schedule
        public async Task<Guid> Post([FromBody]ScheduledAppointment value)
        {
            

            value.Id = Guid.NewGuid();
            foreach(var s in value.Dates)
            {
                s.Id = Guid.NewGuid();
                foreach(var t in s.Timeslots)
                {
                    t.Id = Guid.NewGuid();
                }
            }

            await table.ExecuteAsync(Microsoft.WindowsAzure.Storage.Table.TableOperation.Insert(new TableData<ScheduledAppointment>(value)));

            return value.Id.Value;
        }

        // PUT: api/Schedule/5
        public async Task<HttpResponseMessage> Put(Guid id, [FromBody]ScheduledAppointment value)
        {
            
            var existing = GetFirstOrDefault(id);
            if (existing == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
            existing.Data = new TableData<ScheduledAppointment>(value).Data;
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
