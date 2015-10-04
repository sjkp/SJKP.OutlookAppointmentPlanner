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
using Microsoft.WindowsAzure.Storage.Queue;

namespace SJKP.OutlookAppointmentPlannerWeb.Controllers
{
    public class AttendeeController : ApiController
    {
        private AttendeeRepository repo;
        private AttendeeQueueRepository queue;

        public AttendeeController()
        {
            this.repo = new AttendeeRepository();
            this.queue = new AttendeeQueueRepository();
        }

        

        // GET: api/Schedule
        public IEnumerable<Attendee> Get()
        {
            throw new NotImplementedException();
        } 


        [Route("api/schedule/{scheduleId}/attendees")]
        [HttpGet]
        public HttpResponseMessage Get(string scheduleId)
        {            
            return Request.CreateResponse(repo.GetAllFormSchedule(scheduleId));
        }

        // POST: api/Attendee
        public async Task<string> Post([FromBody]Attendee value)
        {
            value.Id = Guid.NewGuid().ToString();          
            foreach (var s in value.SelectedDates)
            {
                s.Id = Guid.NewGuid();
                foreach (var t in s.Timeslots)
                {
                    t.Id = Guid.NewGuid();
                }
            }

            await repo.InsertAsync(value);
            await queue.InsertAsync(value);
            return value.Id;
        }

        // PUT: api/Attendee/5
        public async Task<HttpResponseMessage> Put(string id, [FromBody]Attendee value)
        {            
            var existing = repo.GetFirstOrDefault(value.ScheduleId, id);
            if (existing == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            var response = await repo.ReplaceAsync(existing, value);
            await queue.InsertAsync(value);
            return Request.CreateResponse(response.HttpStatusCode);
            
        }

        // DELETE: api/Schedule/5
        public async Task Delete(string id)
        {
            //await base.Delete(id);
        }
    }
}
