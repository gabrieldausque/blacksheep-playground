using System.Text.Json;

namespace BSDoom;

public class Point
{
    public Point()
    {
    }

    public Point(double x, double y, double z)
    {
        X = x;
        Y = y;
        Z = z;
    }

    public double X { get; set; }

    public double Y { get; set; }

    public double Z { get; set; }

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

    public static bool operator ==(Point? a, Point? b)
    {
        if (!object.Equals(a, null) && !object.Equals(b, null))
        {
            return a.Equals(b);
        }

        return object.Equals(a, b);
    }

    public static bool operator !=(Point? a, Point? b)
    {
        return !(a == b);
    }
}