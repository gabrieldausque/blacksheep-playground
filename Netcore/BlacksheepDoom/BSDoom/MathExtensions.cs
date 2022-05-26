using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

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
    
    public class Point
    {
        public Point()
        {
        }

        public Point(int x, int y, int z)
        {
            X = x;
            Y = y;
            Z = z;
        }

        public int X { get; set; }

        public int Y { get; set; }

        public int Z { get; set; }

        public virtual Point Clone()
        {
            return new Point(X, Y, Z);
        }
    }

    public class Vector
    {

        public int X { get; set; }

        public int Y { get; set; }

        public int Z { get; set; }


        public Vector(Point origin, Point endPoint)
        {
            X = endPoint.X - origin.X;
            Y = endPoint.Y - origin.Y;
            Z = endPoint.Z - origin.Z;
        }

        public bool IsColinear(Vector other)
        {
            var kX = X != 0 ? other.X / X : other.X != 0 ? X / other.X : 1;
            var kY = Y != 0 ? other.Y / Y : other.Y != 0 ? Y / other.Y : 1;
            var kZ = Z != 0 ? other.Z / Z: other.Z != 0 ? Z / other.Z : 1;
            return kX == kY && kY == kZ;
        }
    } 

    public class Line
    {
        public Line(Point a, Point b)
        {
            OwnedPoint = a.Clone();
            Direction = new Vector(a, b);
        }

        public Point OwnedPoint { get; }

        public Vector Direction { get; }

        public bool Contains(Point thePoint)
        {
            var otherVector = new Vector(OwnedPoint, thePoint);
            return Direction.IsColinear(otherVector);
        }
    }

    public class Plan
    {
        private readonly Point _ownedPoint;
        private readonly Vector _orthogonalVector;
        private readonly int _dConstant;

        public Plan(Point ownedPoint, Vector orthogonalVector)
        {
            _ownedPoint = ownedPoint;
            _orthogonalVector = orthogonalVector;
            _dConstant = - ((_orthogonalVector.X * _ownedPoint.X) + (_orthogonalVector.Y * _ownedPoint.Y) + (_orthogonalVector.Z * _ownedPoint.Z));
        }

        public bool Contains(Point aPoint)
        {
            return _orthogonalVector.X * aPoint.X + _orthogonalVector.Y * aPoint.Y + _orthogonalVector.Z * aPoint.Z + _dConstant == 0;
        }
    }
}
