using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using SJKP.OutlookAppoinmentPlannerBackend.Models;
using SJKP.OutlookAppointmentPlannerWeb.Models;
using SendGrid;
using System.Net.Mail;
using System.Net;
using SJKP.OutlookAppoinmentPlannerBackend.Controllers;
using System.Globalization;
using System.Configuration;
using System;

namespace SJKP.OutlookAppointment.EmailJob
{
    public class Functions
    {
        private const string fromEmail = "no-reply@schdo.com";
        private const string textEmail = "Please use a mail client that supports HTML to view the message. {0}";

        public async static Task AppointmentCreated([Queue("appointmentcreated")] ScheduledAppointment appointment)
        {
            //Send email to appointment planner
            var message = CreateMessage(appointment);

            message.Subject = string.Format("Schdo.com - Appointment '{0}' created", appointment.Description);

            //Add the HTML and Text bodies
            var template = File.ReadAllText("templates/template1.html");
            message.Html = string.Format(template, appointment.GetLink());
            message.Text = string.Format(textEmail, appointment.GetLink());            
            await Send(message);
        }

        public static async Task AttendeeAccepted([Queue("attendeeaccepted")] Attendee attendeed)
        {
            //Send email to appointment planner
            var scheduleRepository = new ScheduleRepository();
            var tabledata = scheduleRepository.GetFirstOrDefault(attendeed.ScheduleId);
            if (tabledata == null)
                return;
            var schedule = tabledata.Entity;
            var message = CreateMessage(schedule);
            message.Subject = "Schdo.com - Feedback Received";

            var attendeeRepo = new AttendeeRepository();

            var attendees = attendeeRepo.GetAllFormSchedule(attendeed.ScheduleId);

            message.AddTo(schedule.CreatedBy);
            message.Html = string.Format(File.ReadAllText("templates/template2.html"), schedule.Description, BuildHtmlTable(schedule, attendees));
            message.Text = string.Format(textEmail, schedule.GetLink());
            await Send(message);
        }

        public static string BuildHtmlTable(ScheduledAppointment schedule, IEnumerable<Attendee> attendees)
        {
            var culture = new CultureInfo(1033);
            TimeZoneInfo tz = TimeZoneInfo.FindSystemTimeZoneById(schedule.Timezone ?? "W. Europe Standard Time");
            StringBuilder header = new StringBuilder();
            StringBuilder colgroup = new StringBuilder();
            header.Append("<thead><tr><th></th>");
            colgroup.Append("<colgroup><col width=\"100px\" />");
            foreach (var date in schedule.Dates)
            {
                foreach (var timeslot in date.Timeslots)
                {
                    header.AppendFormat("<th>{0}<br/>{1}<br/>{2}</th>", TimeZoneInfo.ConvertTimeFromUtc(date.Date, tz).ToString("ddd", culture), TimeZoneInfo.ConvertTimeFromUtc(date.Date, tz).ToString("dd/MM/yyyy"), timeslot.Time);
                    colgroup.Append("<col width=\"100px\" />");
                }
            }
            header.Append("</tr></thead>");
            colgroup.Append("</colgroup>");
            StringBuilder body = new StringBuilder();
            List<List<bool>> timeSlot = new List<List<bool>>();
            body.Append("<tbody>");
            foreach (var attendee in attendees)
            {
                var availableSlots = new List<bool>();
                body.Append("<tr>");
                body.AppendFormat("<td>{0}</td>", attendee.Name);
                foreach (var date in schedule.Dates)
                {
                    var attendeeDate = attendee.SelectedDates.FirstOrDefault(s => s.Id == date.Id || s.Date == date.Date);
                    foreach (var timeslot in date.Timeslots)
                    {
                        if (attendeeDate != null && attendeeDate.Timeslots.Any(s => (s.Id == timeslot.Id || s.Time == timeslot.Time) && s.Selected))
                        {
                            body.Append("<td align=\"center\" style=\"background-color:lightgreen\">Yes</td>");
                            availableSlots.Add(true);
                        }
                        else
                        {
                            body.Append("<td align=\"center\" style=\"background-color:lightpink\">No</td>");
                            availableSlots.Add(false);
                        }
                    }
                }
                body.Append("</tr>");
                timeSlot.Add(availableSlots);
            }
            body.AppendFormat("<tr><td colspan=\"{0}\"><hr /></td></tr>",schedule.Dates.Sum(s => s.Timeslots.Count())+1);
            body.Append("<tr><td>Total</td>");
            var total = timeSlot.Count;
            for (int i = 0; i < timeSlot.First().Count; i++)
            {
                var rowCount = timeSlot.Count(s => s[i]);
                if (rowCount == total)
                {
                    body.AppendFormat("<td align=\"center\" style=\"background-color:lightgreen\">{0}</td>", total);
                }
                else
                {
                    body.AppendFormat("<td align=\"center\" style=\"background-color:lightpink\">{0}</td>", rowCount);
                }
            }
            body.Append("</tr></tbody>");

            return string.Format("<table>{0}{1}{2}</table>", colgroup.ToString(), header.ToString(), body.ToString());
        }

        private async static Task Send(SendGridMessage message)
        {
            var username = ConfigurationManager.AppSettings["SENDGRID_USER"];
            var pswd = ConfigurationManager.AppSettings["SENDGRID_PASS"];
            message.DisableClickTracking();
            var credentials = new NetworkCredential(username, pswd);
            // Create an Web transport for sending email.
            var transportWeb = new Web(credentials);

            // Send the email, which returns an awaitable task.
            await transportWeb.DeliverAsync(message);
        }

        private static SendGridMessage CreateMessage(ScheduledAppointment appointment)
        {
            var myMessage = new SendGridMessage();

            // Add the message properties.
            myMessage.From = new MailAddress(fromEmail);

            myMessage.AddTo(appointment.CreatedBy);
            return myMessage;
        }
    }
}
