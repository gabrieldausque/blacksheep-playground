using Timer = System.Threading.Timer;

namespace BSDoom;

public class GameLoop
{
    private Timer _internalTimer;

    public GameLoop(int frameRateInHertz = 60)
    {
        FrameRateInHertz = frameRateInHertz;
    }

    public int FrameRateInHertz { get; private set; }

    public event EventHandler Init;

    public event EventHandler Update;

    public event EventHandler Draw;

    protected virtual async Task RaiseInitEvent()
    {
        await Task.Run(() =>
        {
            Init?.Invoke(this, EventArgs.Empty);
        });
    }

    protected virtual async Task RaiseUpdateEvent()
    {
        await Task.Run(() =>
        {
            Update?.Invoke(this, EventArgs.Empty);
        });
    }

    protected virtual async Task RaiseDrawEvent()
    {
        await Task.Run(() =>
        {
            Draw?.Invoke(this, EventArgs.Empty);
        });
    }

    private object _lockObject = new object();
    private bool _isRunning;
    public virtual async Task Start()
    {
        await RaiseInitEvent();


        _internalTimer = new Timer(state =>
        {
            lock (_lockObject)
            {
                if (!_isRunning)
                {
                    _isRunning = true;
                    RunGameFrame().ContinueWith((t) =>
                    {
                        _isRunning = false;
                    });
                }
            }
        }, null, 0, (int)Math.Ceiling(1000d / FrameRateInHertz));
    }

    public virtual async Task RunGameFrame()
    {
        await RaiseUpdateEvent();
        await RaiseDrawEvent();
    }

    public async void Stop()
    {
        _internalTimer?.Change(0, Timeout.Infinite);
    }
}