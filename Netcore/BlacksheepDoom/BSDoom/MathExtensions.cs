using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using Microsoft.VisualBasic.CompilerServices;

namespace BSDoom
{
    public class MathExtensions
    {
        public static int Square(int arg) 
        {
            return arg * arg;
        }

        public static double Square(double arg)
        {
            return arg * arg;
        }

    }
}
