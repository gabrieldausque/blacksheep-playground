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

        [Test]
        public void Should_check_if_unitary_vector_is_orthogonal_to_others()
        {
            var xVector = new Vector(1, 0, 0);
            var yVector = new Vector(0, 1, 0);
            var zVector = new Vector(0, 0, 1);
            Assert.That(xVector^yVector, Is.EqualTo(zVector));
            Assert.That(yVector^zVector, Is.EqualTo(xVector));
            Assert.That(zVector^xVector, Is.EqualTo(yVector));
        }

        [Test]
        public void Should_calculate_intersection_point_of_plan_and_a_line()
        {
            var plan = new Plan(new Point(0, 0, 0), new Vector(0,0,1));
            var line = new Line(new Point(3, 3, 3), new Vector(0, 0, 3));
            var expected = new Point(3, 3, 0);
            Assert.That(Geometry.GetIntersection(line, plan), Is.EqualTo(expected));
            plan = new Plan(new Point(0, 0, 0), new Vector(1, 0, 0));
            line = new Line(new Point(3, 3, 3), new Vector(3, 0, 0));
            expected = new Point(0, 3, 3);
            Assert.That(Geometry.GetIntersection(line, plan), Is.EqualTo(expected));
            plan = new Plan(new Point(0, 0, 0), new Vector(0, 1, 0));
            line = new Line(new Point(3, 3, 3), new Vector(0, 3, 0));
            expected = new Point(3, 0, 3);
            Assert.That(Geometry.GetIntersection(line, plan), Is.EqualTo(expected));
        }
        
    }
}