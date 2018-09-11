using System;
using System.Collections.Generic;

namespace PostApplication.Models
{
    public partial class TPostApplication
    {
        public string ApplicationNo { get; set; }
        public string DemandNo { get; set; }
        public string ResourceNo { get; set; }
        public DateTime? ApplyDate { get; set; }
        public string Status { get; set; }
        public DateTime? CloseDate { get; set; }
        public string RegisterUser { get; set; }
        public DateTime? RegisterDate { get; set; }
        public string UpdateUser { get; set; }
        public DateTime? UpdateDate { get; set; }
    }
}
