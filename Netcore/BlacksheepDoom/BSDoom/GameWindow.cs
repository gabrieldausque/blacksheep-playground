

using System.Diagnostics;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Drawing.Text;
using System.Runtime.InteropServices;

namespace BSDoom
{
    public partial class GameWindow : Form
    {
        private bool _isFullScreen = false;
        private Size _previousSize = Size.Empty;
        private int _previousTop = 0;
        private int _previousLeft = 0;
        private Bitmap _bitmap;
        private readonly GameLoop _gameLoop;
        private int _frameCountPerSecond = 0;
        private DateTime _lastMeasuringFrame = DateTime.Now;
        private GameObject _pov;
        private GameObject _screen;
        private GameObject _firstObject;


        //TODO : inject the game loop
        public GameWindow()
        {
            InitializeComponent();
            _gameLoop = new GameLoop(60);
            this.Paint += GameWindow_Paint;
            this.Closing += GameWindow_Closing;
            _gameLoop.Init += _gameLoop_Init;
            _gameLoop.Draw += _gameLoop_Draw;
            _gameLoop.Update += _gameLoop_Update;
            _gameLoop.Start();
        }

        private void _gameLoop_Init(object? sender, EventArgs e)
        {
            //TODO : at the end, load a file that will describe the complete game 
            //TODO : add the first game object, a simple square
            _pov = new GameObject();
            _pov.Components.Add(new PositionComponent(512, 384, 384));

            _screen = new GameObject();
            _screen.Components.Add(new PositionComponent(0,0,0));
            _screen.Components.Add(new BodyComponent(1024,768,0));

            _firstObject = new GameObject();
            _firstObject.Components.Add(new PositionComponent(256, 192, 0));
            _firstObject.Components.Add(new BodyComponent(512, 384, 0));
            _firstObject.Components.Add(new ColorComponent(Color.Red));
        }

        private void _gameLoop_Update(object? sender, EventArgs e)
        {
            //TODO : update all object
        }

        private void GameWindow_Paint(object? sender, PaintEventArgs e)
        {
            if (_bitmap != null)
            {
                var bitmapToDraw = _bitmap;
                var previous = e.Graphics.InterpolationMode;
                e.Graphics.InterpolationMode = InterpolationMode.NearestNeighbor;
                e.Graphics.DrawImage(bitmapToDraw, 0, 0, Width, Height);
                e.Graphics.InterpolationMode = previous;
            }
        }

        private void GameWindow_Closing(object? sender, System.ComponentModel.CancelEventArgs e)
        {
            _gameLoop.Stop();
        }

        private void _gameLoop_Draw(object? sender, EventArgs e)
        {
            _frameCountPerSecond++;
            var currentDatetime = DateTime.Now;
            DrawBitmap();
            if (currentDatetime.Subtract(_lastMeasuringFrame).TotalSeconds > 1)
            {
                var localFps = _frameCountPerSecond;
                lblFps.BeginInvoke(() =>
                {
                    lblFps.Text = $"fps : {localFps}";
                });    
                _frameCountPerSecond = 0;
                _lastMeasuringFrame = currentDatetime;
            }
        }

        private void GameWindow_KeyPress(object sender, KeyPressEventArgs e)
        {
            if ((e.KeyChar == (char)Keys.Return ||
                 e.KeyChar == (char)Keys.Enter ||
                 e.KeyChar == (char)Keys.LineFeed) &&
                (ModifierKeys == Keys.Control))
            {
                if (_isFullScreen)
                {
                    WindowState = FormWindowState.Normal;
                    FormBorderStyle = FormBorderStyle.FixedSingle;
                    TopMost = false;
                    Size = _previousSize;
                    Left = _previousLeft;
                    Top = _previousTop;
                    _isFullScreen = false;
                }
                else
                {
                    FormBorderStyle = FormBorderStyle.None;
                    TopMost = true;
                    Screen currentScreen = Screen.FromHandle(this.Handle);
                    _previousSize = Size;
                    _previousTop = Top;
                    _previousLeft = Left;
                    Size = new System.Drawing.Size(currentScreen.Bounds.Width, currentScreen.Bounds.Height);
                    Top = 0;
                    Left = 0;
                    _isFullScreen = true;
                }
            }
        }

        private void DrawBitmap()
        {
            var screenPosition = _screen.Components.First(c => c is PositionComponent) as PositionComponent;
            var screenBody = _screen.Components.First(c => c is BodyComponent) as BodyComponent;

            var bitmapToDraw = new Bitmap(screenBody.Width, screenBody.Height, PixelFormat.Format32bppArgb);
            byte[] imageData = new byte[screenBody.Width * screenBody.Height * 4]; //you image data here
            Parallel.For(screenPosition.Y, screenPosition.Y + screenBody.Height, (index) =>
            {
                for (int x = screenPosition.X; x < screenPosition.X + screenBody.Width; x++)
                {
                    //Calcul de la droite entre l'observateur et le point de l'écran en cours

                    //Calcul de l'intersection avec chaque objet devant l'observateur
                    //Si intersection : calcul de la couleur du point
                }
            });
            
            BitmapData bmData = bitmapToDraw.LockBits(new System.Drawing.Rectangle(0, 0,
                    bitmapToDraw.Width, bitmapToDraw.Height), 
                ImageLockMode.ReadWrite,
                bitmapToDraw.PixelFormat);
            IntPtr pNative = bmData.Scan0;
            Marshal.Copy(imageData, 0, pNative, imageData.Length);
            bitmapToDraw.UnlockBits(bmData);
            _bitmap = bitmapToDraw;
            //Invalidate();
            //g.DrawImage(_bitmap, 0,0,Width, Height);
        }

    }

    public class ColorComponent : GameComponent
    {
        public Color Color { get; set; }

        public ColorComponent(Color color)
        {
            Color = color;
        }
    }

    public class BodyComponent : GameComponent
    {
        public BodyComponent(int width, int height, int depth)
        {
            Width = width;
            Height = height;
            Depth = depth;
        }

        public int Depth { get; set; }

        public int Height { get; set; }

        public int Width { get; set; }
    }

    public class PositionComponent : GameComponent
    {
        public PositionComponent(int x, int y, int z)
        {
            X = x;
            Y = y;
            Z = z;
        }

        public int Z { get; set; }

        public int Y { get; set; }

        public int X { get; set; }
    }
}