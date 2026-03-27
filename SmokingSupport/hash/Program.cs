using System;
using BCrypt.Net;
namespace hash
{
    internal class Program
    {
        static void Main(string[] args)
        {
            string plainPassword = "Admin@123";
            string hashedPassword = BCrypt.Net.BCrypt.HashPassword(plainPassword);
            Console.WriteLine("Hashed password: " + hashedPassword);
        }
    }
}
