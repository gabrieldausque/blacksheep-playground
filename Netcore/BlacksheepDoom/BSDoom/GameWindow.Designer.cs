namespace BSDoom
{
    partial class GameWindow
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.lblFps = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // lblFps
            // 
            this.lblFps.AutoSize = true;
            this.lblFps.BackColor = System.Drawing.Color.Transparent;
            this.lblFps.Font = new System.Drawing.Font("Segoe UI", 9F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point);
            this.lblFps.ForeColor = System.Drawing.Color.White;
            this.lblFps.Location = new System.Drawing.Point(0, 0);
            this.lblFps.Name = "lblFps";
            this.lblFps.Size = new System.Drawing.Size(43, 20);
            this.lblFps.TabIndex = 0;
            this.lblFps.Text = "fps : ";
            // 
            // GameWindow
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(8F, 20F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.CornflowerBlue;
            this.ClientSize = new System.Drawing.Size(1006, 721);
            this.Controls.Add(this.lblFps);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.Name = "GameWindow";
            this.Text = "GameWindow";
            this.KeyPress += new System.Windows.Forms.KeyPressEventHandler(this.GameWindow_KeyPress);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private Label lblFps;
    }
}