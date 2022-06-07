using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.NetworkInformation;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Nodes;
using System.Threading.Tasks;
using Microsoft.VisualBasic.CompilerServices;
using System.Text.Json;
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

        public override string ToString()
        {
            return JsonSerializer.Serialize(this);
        }

        public override bool Equals(object? obj)
        {
            if (obj is Point other)
            {
                return Equals(other);
            }
            return false;
        }

        public bool Equals(Point other)
        {
            if (other != null)
            {
                return X == other.X && Y == other.Y && Z == other.Z;
            }

            return false;
        }

        public static bool operator ==(Point a, Point b)
        {
            if (!object.Equals(a, null) && !object.Equals(b, null))
            {
                return a.Equals(b);
            }

            return object.Equals(a, b);
        }

        public static bool operator !=(Point a, Point b)
        {
            return !(a == b);
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

        public Vector(int x=0, int y=0, int z=0)
        {
            X = x;
            Y = y;
            Z = z;
        }

        public bool IsColinear(Vector other)
        {
            var kX = X != 0 ? other.X / X : other.X != 0 ? X / other.X : 1;
            var kY = Y != 0 ? other.Y / Y : other.Y != 0 ? Y / other.Y : 1;
            var kZ = Z != 0 ? other.Z / Z: other.Z != 0 ? Z / other.Z : 1;
            return kX == kY && kY == kZ;
        }

        public static Vector GetOrthogonalVector(Point origin, 
            Vector a, 
            Vector b)
        {
            return a^b;
        }

        public bool IsOrthogonal(Vector aLineDirection)
        {
            return (this ^ aLineDirection) == Vector.Zero;
        }

        public static Vector Zero { get; } = new Vector();

        public static Vector operator ^(Vector a, Vector b)
        {
            var X = (a.Y * b.Z) - (a.Z * b.Y);
            var Y = (a.Z * b.X) - (a.X * b.Z);
            var Z = (a.X * b.Y) - (a.Y * b.X);
            return new Vector(X, Y, Z);
        }

        public override bool Equals(object? obj)
        {
            if (obj is Vector other)
            {
                return Equals(other);
            }

            return false;
        }

        public bool Equals(Vector other)
        {
            return X == other.X &&
                   Y == other.Y &&
                   Z == other.Z;
        }

        public static bool operator ==(Vector a, Vector b)
        {
            if( !Equals(a, null) && !Equals(b,null))
                return a.Equals(b);

            return Equals(a, null) && Equals(b, null);
        }

        public static bool operator !=(Vector a, Vector b)
        {
            return !(a == b);
        }
    } 

    public class Line
    {
        public Line(Point a, Point b)
        {
            OwnedPoint = a.Clone();
            Direction = new Vector(a, b);
        }

        public Line(Point ownedPoint, Vector direction)
        {
            OwnedPoint = ownedPoint;
            Direction = direction;
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

        public Vector OrthogonalVector => _orthogonalVector;

        public int DConstant => _dConstant;

        public bool Contains(Point aPoint)
        {
            return _orthogonalVector.X * aPoint.X + _orthogonalVector.Y * aPoint.Y + _orthogonalVector.Z * aPoint.Z + _dConstant == 0;
        }
    }

    public class Quadrilateral
    {
        private readonly Point _origin;
        private readonly Vector _width;
        private readonly Vector _length;

        public Quadrilateral(Point origin, Vector width, Vector length)
        {
            _origin = origin;
            _width = width;
            _length = length;
        }

        public Plan GetPlan()
        {
            return new Plan(_origin, Vector.GetOrthogonalVector(_origin, 
                _width, _length));
        }

        public Point[] GetPoints()
        {
            var rightTop = new Point(_origin.X + _width.X, _origin.Y + _width.Y, _origin.Z + _width.Z);
            var rightBottom = new Point(rightTop.X + _length.X, rightTop.Y + _length.Y, rightTop.Z + _width.Z);
            var leftBottom = new Point(_origin.X + _length.X, _origin.Y + _length.Y, _origin.Z + _length.Z);
            return new[]
            {
                _origin,
                rightTop,
                rightBottom,
                leftBottom
            };
        }

        public bool TryGetIntersection(Line aLine, out Point? intersection)
        {
            var thePlan = GetPlan();
            if (!thePlan.Contains(aLine.OwnedPoint) && !thePlan.OrthogonalVector.IsOrthogonal(aLine.Direction))
            {
                intersection = Geometry.GetIntersection(aLine, thePlan);
                return intersection != null ;
            }

            intersection = null;
            return false;
        }
    }

    public static class Geometry
    {
        public static Point? GetIntersection(Line line, Plan plan)
        {
            var stopWatch = Stopwatch.StartNew();
            Point? intersection;
            try
            {
                var t = -1 * ((plan.OrthogonalVector.X * line.OwnedPoint.X +
                               plan.OrthogonalVector.Y * line.OwnedPoint.Y +
                               plan.OrthogonalVector.Z * line.OwnedPoint.Z + plan.DConstant) /
                              (plan.OrthogonalVector.X * line.Direction.X + plan.OrthogonalVector.Y * line.Direction.Y +
                               plan.OrthogonalVector.Z * line.Direction.Z));
                var X = line.OwnedPoint.X + line.Direction.X * t;
                var Y = line.OwnedPoint.Y + line.Direction.Y * t;
                var Z = line.OwnedPoint.Z + line.Direction.Z * t;
                intersection = new Point(X, Y, Z);
            }
            catch(Exception ex)
            {
                intersection = null;
            }
            stopWatch.Stop();
            Console.WriteLine($"Get intersect time : {stopWatch.ElapsedMilliseconds} ms");
            return  intersection;
        }
    }
}
