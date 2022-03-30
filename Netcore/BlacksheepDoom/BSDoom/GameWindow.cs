namespace BSDoom
{
    public partial class GameWindow : Form
    {
        private bool _isFullScreen = false;
        private Size _previousSize = Size.Empty;
        private int _previousTop = 0;
        private int _previousLeft = 0;
        public GameWindow()
        {
            InitializeComponent();

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
    }
}