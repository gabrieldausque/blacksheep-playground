

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
        
        public GameWindow()
        {
            InitializeComponent();
            _gameLoop = new GameLoop(60);
            this.Paint += GameWindow_Paint;
            this.Closing += GameWindow_Closing;
            _gameLoop.Draw += _gameLoop_Draw;
            _gameLoop.Update += _gameLoop_Update;
            _gameLoop.Start();
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
            var bitmapToDraw = new Bitmap(200, 200, PixelFormat.Format24bppRgb);
            byte[] imageData = new byte[200 * 200 *3]; //you image data here
            Parallel.For(0, imageData.Length, (index) =>
            {
                if(index % 3 == 2)
                    imageData[index] = 255;
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
}