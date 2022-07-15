namespace BSDoom;

public class Plan
{
    private readonly Point _ownedPoint;
    private readonly Vector _orthogonalVector;
    private readonly double _dConstant;

    public Plan(Point ownedPoint, Vector orthogonalVector)
    {
        _ownedPoint = ownedPoint;
        _orthogonalVector = orthogonalVector;
        _dConstant = - ((_orthogonalVector.X * _ownedPoint.X) + (_orthogonalVector.Y * _ownedPoint.Y) + (_orthogonalVector.Z * _ownedPoint.Z));
    }

    public Vector OrthogonalVector => _orthogonalVector;

    public double DConstant => _dConstant;

    public bool Contains(Point aPoint)
    {
        return _orthogonalVector.X * aPoint.X + _orthogonalVector.Y * aPoint.Y + _orthogonalVector.Z * aPoint.Z + _dConstant == 0;
    }
}