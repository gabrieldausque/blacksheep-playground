namespace BSDoom;

public class Vector
{

    public double X { get; set; }

    public double Y { get; set; }

    public double Z { get; set; }


    public Vector(Point origin, Point endPoint)
    {
        X = endPoint.X - origin.X;
        Y = endPoint.Y - origin.Y;
        Z = endPoint.Z - origin.Z;
    }

    public Vector(double x=0, double y=0, double z=0)
    {
        X = x;
        Y = y;
        Z = z;
    }

    public bool IsColinear(Vector other)
    {
        return (other ^ this) == Zero;
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