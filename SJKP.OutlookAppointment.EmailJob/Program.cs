using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;

namespace SJKP.OutlookAppointment.EmailJob
{
    // To learn more about Microsoft Azure WebJobs SDK, please see http://go.microsoft.com/fwlink/?LinkID=320976
    class Program
    {
        // Please set the following connection strings in app.config for this WebJob to run:
        // AzureWebJobsDashboard and AzureWebJobsStorage
        static void Main()
        {
            var config = new JobHostConfiguration();
            config.Queues.MaxPollingInterval = TimeSpan.FromMinutes(1);
            config.Queues.MaxDequeueCount = 3;

            var host = new JobHost(config);
            host.RunAndBlock();
        }
    }
}
