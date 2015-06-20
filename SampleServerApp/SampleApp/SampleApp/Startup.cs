using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(SampleApp.Startup))]
namespace SampleApp
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
