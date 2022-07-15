namespace BSDoom;

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

    public bool HasIntersection(Quadrilateral quadrilatere)
    {
        if (Geometry.TryGetIntersection(this, quadrilatere.GetPlan(), out Point? intersection))
        {
            if (intersection != null)
            {
                return Contains(intersection);
            }
        }

        return false;
    }
}