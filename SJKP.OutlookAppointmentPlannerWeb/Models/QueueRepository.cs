using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Queue;
using Newtonsoft.Json;

namespace SJKP.OutlookAppointmentPlannerWeb.Models
{
    public class QueueRepository<T>
    {
        private CloudQueueClient client;
        private CloudQueue queue;
        private static bool exists;

        public QueueRepository(string queueName)
        {
            var storageAccount = CloudStorageAccount.Parse(ConfigurationManager.AppSettings["CloudStorageAccount"]);
            this.client = storageAccount.CreateCloudQueueClient();
            this.queue = client.GetQueueReference(queueName);            
        }

        public async Task InsertAsync(T model)
        {
            var insert = queue.AddMessageAsync(new CloudQueueMessage(JsonConvert.SerializeObject(model)));

            if (exists==false)
            {
                await queue.CreateIfNotExistsAsync().ContinueWith(s =>
                {
                    exists = true;
                }).ContinueWith(t => insert);
                return;
            }
            await insert;
        }
    }
}
