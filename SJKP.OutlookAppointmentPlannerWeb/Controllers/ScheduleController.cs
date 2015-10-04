using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using SJKP.OutlookAppoinmentPlannerBackend.Models;
using SJKP.OutlookAppointmentPlannerWeb.Models;
using SJKP.ShortCode;
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
    public class ScheduleController : ApiController
    {
        private ScheduleRepository repo;
        private ScheduleQueueRepository queue;

        public ScheduleController() 
        {
            repo = new ScheduleRepository();
            queue = new ScheduleQueueRepository();
        }
        // GET: api/Schedule
        public IEnumerable<ScheduledAppointment> Get()
        {
            return repo.SelectMany();
        }

        // GET: api/Schedule/5
        public HttpResponseMessage Get(string id)
        {
            var entity = repo.GetFirstOrDefault(id);
            if (entity == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }
            return Request.CreateResponse(entity.Entity);
        }

        

        // POST: api/Schedule
        public async Task<string> Post([FromBody]ScheduledAppointment value)
        {
            

            value.Id = ShortCode.ShortCode.NewShortCode();
            foreach(var s in value.Dates)
            {
                s.Id = Guid.NewGuid();
                foreach(var t in s.Timeslots)
                {
                    t.Id = Guid.NewGuid();
                }
            }

            await repo.InsertAsync(value);
            await queue.InsertAsync(value);
            return value.Id;
        }

        // PUT: api/Schedule/5
        public async Task<HttpResponseMessage> Put(string id, [FromBody]ScheduledAppointment value)
        {
            
            var existing = repo.GetFirstOrDefault(id);
            if (existing == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            var response = await repo.ReplaceAsync(existing, value);
            return Request.CreateResponse(response.HttpStatusCode);
        }

        // DELETE: api/Schedule/5
        public async Task Delete(string id)
        {
            //await base.Delete(id);
        }
    }
}
