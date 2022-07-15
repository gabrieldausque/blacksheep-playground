using System.Diagnostics;

namespace BSDoom;

public static class Geometry
{
    public static Point? GetIntersection(Line line, Plan plan)
    {
        var stopWatch = Stopwatch.StartNew();
        Point? intersection;
        try
        {

            var t = -(plan.DConstant + (plan.OrthogonalVector.X * line.OwnedPoint.X) +
                      (plan.OrthogonalVector.Y * line.OwnedPoint.Y) +
                      (plan.OrthogonalVector.Z * line.OwnedPoint.Z)) /
                    ((plan.OrthogonalVector.X * line.Direction.X) + (plan.OrthogonalVector.Y * line.Direction.Y) +
                     (plan.OrthogonalVector.Z * line.Direction.Z));
            var X = line.OwnedPoint.X + t*line.Direction.X;
            var Y = line.OwnedPoint.Y + t*line.Direction.Y;
            var Z = line.OwnedPoint.Z + t*line.Direction.Z;
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

    public static bool TryGetIntersection(Line line, Plan thePlan, out Point? intersection)
    {
        intersection = GetIntersection(line, thePlan);
        return intersection != null;
    }
}