using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SJKP.OutlookAppoinmentPlannerBackend.Models
{
    public class TableData<T> : TableEntity where T: class, IId 
    {
        public TableData()
        {

        }
        public TableData(T data)
        {
            base.PartitionKey = data.GetType().Name;
            base.RowKey = data.Id.Value.ToString();
            this.Data = JsonConvert.SerializeObject(data);
        }

        public string Data { get; set; }

        public T Entity
        {
            get
            {
                return JsonConvert.DeserializeObject<T>(Data);
            }
        }
    }
}