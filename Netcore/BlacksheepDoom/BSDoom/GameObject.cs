using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BSDoom
{
    public class GameObject
    {
        public Guid Id { get; }

        public GameObject()
        {
            Id = Guid.NewGuid();
            Components = new List<GameComponent>();
        }

        public List<GameComponent> Components { get; }
    }

    public class GameComponent
    {
    }


}
