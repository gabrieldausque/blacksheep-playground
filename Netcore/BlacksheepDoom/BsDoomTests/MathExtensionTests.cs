using System.Diagnostics;
using BSDoom;

namespace BsDoomTests
{
    public class MathExtensionsTests
    {
        [SetUp]
        public void Setup()
        {
        }

        [Test]
        [TestCase(0,0,0,0,0,5,0,0,9)]
        [TestCase(0,0,0,3,3,3,-9,-9,-9)]
        public void Should_Check_if_a_point_is_in_a_line(int xA, int yA, int zA, int xB, int yB, int zB, int xC, int yC, int zC)
        {
            var theLine = new Line(new Point(xA, yA, zA), new Point(xB, yB, zB));
            var thePoint = new Point(xC, yC, zC);
            Assert.IsTrue(theLine.Contains(thePoint));
        }

        [Test]
        public void Should_check_if_a_point_is_in_a_plan()
        {
            var thePlane = new Plan(new Point(0, 0, 0), new Vector(new Point(0, 0, 0), new Point(0, 0, 1)));
            var thePoint = new Point(5, 15, 0);
            Assert.IsTrue(thePlane.Contains(thePoint));
        }
    }
}