namespace BSDoom;

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

    public bool Contains(Point point)
    {
        if (GetPlan().Contains(point))
        {

            return ((point.X >= MinX() && point.X < MaxX()) || 
                    (point.X <= MaxX() && point.X > MinX())) &&
                   (point.Y >= MinY() && point.Y < MaxY()) ||
                   (point.Y <= MaxY() && point.Y > MinY()) &&
                   (point.Z >= MinZ() && point.Z < MaxZ()) ||
                   (point.Z <= MaxZ() && point.Z > MinZ());
        }
        return false;
    }

    private double MaxZ()
    {
        return GetPoints().Select(p => p.Z).Max();
    }

    private double MinZ()
    {
        return GetPoints().Select(p => p.Z).Min();

    }

    private double MaxY()
    {
        return GetPoints().Select(p => p.Y).Max();

    }

    private double MinY()
    {
        return GetPoints().Select(p => p.Y).Min();

    }

    private double MaxX()
    {
        return GetPoints().Select(p => p.X).Max();
    }

    public double MinX()
    {
        return GetPoints().Select(p => p.X).Min();
    }
}