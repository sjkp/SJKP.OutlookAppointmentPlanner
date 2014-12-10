﻿using Microsoft.WindowsAzure.Storage.Table;
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
            base.PartitionKey = GetPartitionKey(data);
            base.RowKey = GetRowKey(data);
            this.Data = JsonConvert.SerializeObject(data);
        }

        protected virtual string GetPartitionKey(T data)
        {
            return data.GetType().Name;
        }

        protected virtual string GetRowKey(T data)
        {
            return data.Id.Value.ToString();
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