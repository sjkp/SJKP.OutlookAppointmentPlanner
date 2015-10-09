using System;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SJKP.OutlookAppointment.EmailJob;
using SJKP.OutlookAppoinmentPlannerBackend.Models;
using System.Collections.Generic;
using SJKP.OutlookAppointmentPlannerWeb.Models;
using System.Threading.Tasks;

namespace SJKP.OutlookAppointmentPlanner.Test
{
    [TestClass]
    public class EmailJobTest
    {
        [TestMethod]
        public void TestBuildHtmlTable()
        {
            var model = new ScheduledAppointment() {
                Dates = new List<ScheduledDate>() {
                    new ScheduledDate() {
                        Date = DateTime.Today.ToUniversalTime(),
                        Id = Guid.NewGuid(),
                        Timeslots = new List<ScheduledTimeslot>() {
                            new ScheduledTimeslot() {
                                Id = Guid.NewGuid(),
                                Time = "8-10",
                                Selected = true,
                            },
                            new ScheduledTimeslot() {
                                Id = Guid.NewGuid(),
                                Time = "10-12",
                                Selected = true,
                            }
                        }
                    },
                    new ScheduledDate() {
                        Date = DateTime.Today.ToUniversalTime().AddDays(2),
                        Id = Guid.NewGuid(),
                        Timeslots = new List<ScheduledTimeslot>() {
                            new ScheduledTimeslot() {
                                Id = Guid.NewGuid(),
                                Time = "9-10",
                                Selected = true,
                            },                            
                        }
                    },
                    new ScheduledDate() {
                        Date = DateTime.Today.ToUniversalTime().AddDays(3),
                        Id = Guid.NewGuid(),
                        Timeslots = new List<ScheduledTimeslot>() {
                            new ScheduledTimeslot() {
                                Id = Guid.NewGuid(),
                                Time = "20-22",
                                Selected = true,
                            },                            
                        }
                    }
                }

            };

            var attendees = new List<Attendee>() {
                new Attendee() {
                    Name = "Simon",
                    SelectedDates = new List<ScheduledDate>() {
                        new ScheduledDate() {
                            Id = model.Dates.ElementAt(0).Id,
                            Timeslots = new ScheduledTimeslot[] {model.Dates.ElementAt(0).Timeslots.ElementAt(0)}
                        }
                    }
                },
                new Attendee() {
                    Name = "Simon 2",
                    SelectedDates = new List<ScheduledDate>() {
                        new ScheduledDate() {
                            Id = model.Dates.ElementAt(0).Id,
                            Timeslots = new ScheduledTimeslot[] {model.Dates.ElementAt(0).Timeslots.ElementAt(0), model.Dates.ElementAt(0).Timeslots.ElementAt(1)}
                        },
                        new ScheduledDate() 
                        {
                            Id = model.Dates.ElementAt(2).Id,
                            Timeslots = new ScheduledTimeslot[] {model.Dates.ElementAt(2).Timeslots.ElementAt(0)}
                        }
                    }
                }
            };

            var result = Functions.BuildHtmlTable(model, attendees);
            Console.WriteLine(result);
        }
        [TestMethod]
        public async Task TestAppointmentCreated()
        {
            var model = new ScheduledAppointment()
            {
                Dates = new List<ScheduledDate>() {
                    new ScheduledDate() {
                        Date = DateTime.Today,
                        Id = Guid.NewGuid(),
                        Timeslots = new List<ScheduledTimeslot>() {
                            new ScheduledTimeslot() {
                                Id = Guid.NewGuid(),
                                Time = "8-10",
                                Selected = true,
                            },
                            new ScheduledTimeslot() {
                                Id = Guid.NewGuid(),
                                Time = "10-12",
                                Selected = true,
                            }
                        }
                    }
                },
                CreatedBy = "admin@sjkpdevs.onmicrosoft.com",
                Description = "Test Descripition",
                Id = ShortCode.ShortCode.NewShortCode()
        };
            await Functions.AppointmentCreated(model);
        }
    }
}
