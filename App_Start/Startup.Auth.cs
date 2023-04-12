using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.Google;
using Microsoft.Owin.Security.OAuth;
using Owin;
using WebApiCore.Providers;
using WebApiCore.Models;
using Microsoft.Owin.Security.Facebook;
using WebApiCore.Controllers;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Owin.Security;
using Microsoft.Owin.Host.SystemWeb;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security.OpenIdConnect;
using System.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using IdentityModel.Client;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json.Linq;
using System.Net;
using System.Net.Sockets;

namespace WebApiCore
{
    public partial class Startup
    {
        public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }

        public static string PublicClientId { get; private set; }

        public static string GG_ClientId = ConfigurationManager.AppSettings["GG_ClientId"];
        public static string GG_ClientSecret = ConfigurationManager.AppSettings["GG_ClientSecret"];

        public static string CurrentHostName = ConfigurationManager.AppSettings["Hostname"];
        public static string Oidc_ClientId = ConfigurationManager.AppSettings["Oidc_ClientId"];
        public static string Oidc_ClientSecret = ConfigurationManager.AppSettings["Oidc_ClientSecret"];
        public static string Oidc_ClientSecretName = ConfigurationManager.AppSettings["Oidc_ClientSecretName"];
        public static string Oidc_Authority = ConfigurationManager.AppSettings["Oidc_Authority"];
        public static string Oidc_RedirectUri = CurrentHostName + "/signin-oidc";
        public static string Oidc_Scope = "openid profile email";

        // For more information on configuring authentication, please visit http://go.microsoft.com/fwlink/?LinkId=301864
        public void ConfigureAuth(IAppBuilder app)
        {
            // Configure the db context and user manager to use a single instance per request
            app.CreatePerOwinContext(ApplicationDbContext.Create);
            app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);


            // Enable the application to use a cookie to store information for the signed in user
            // and to use a cookie to temporarily store information about a user logging in with a third party login provider
            app.UseCookieAuthentication(new CookieAuthenticationOptions());
            app.UseExternalSignInCookie(DefaultAuthenticationTypes.ExternalCookie);

            // Configure the application for OAuth based flow
            PublicClientId = "self";
            OAuthOptions = new OAuthAuthorizationServerOptions
            {
                TokenEndpointPath = new PathString("/Token"),
                Provider = new ApplicationOAuthProvider(PublicClientId),
                AuthorizeEndpointPath = new PathString("/api/Account/ExternalLogin"),
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(1),
                // In production mode set AllowInsecureHttp = false
                AllowInsecureHttp = true
            };

            // Enable the application to use bearer tokens to authenticate users
            app.UseOAuthBearerTokens(OAuthOptions);

            var ggOptions = new GoogleOAuth2AuthenticationOptions()
            {
                ClientId = GG_ClientId,
                ClientSecret = GG_ClientSecret
            };
            app.UseGoogleAuthentication(ggOptions);

            app.UseOpenIdConnectAuthentication(new OpenIdConnectAuthenticationOptions
            {
                Authority = Oidc_Authority,
                ClientId = Oidc_ClientId,
                ClientSecret = Oidc_ClientSecret,
                RedirectUri = Oidc_RedirectUri,
                ResponseType = OpenIdConnectResponseType.Code,
                UsePkce = true,
                Scope = Oidc_Scope,
                PostLogoutRedirectUri = CurrentHostName,
                Notifications = new OpenIdConnectAuthenticationNotifications
                {
                    AuthenticationFailed = context =>
                    {
                        context.HandleResponse();
                        context.Response.Redirect("/Error?message=" + context.Exception.Message);
                        return Task.FromResult(0);
                    },
                    AuthorizationCodeReceived = async context =>
                    {
                        var code = context.Code;
                        var codeVerifier = context.TokenEndpointRequest.Parameters["code_verifier"];
                        
                        context.HandleResponse();
                        context.Response.Redirect("/signin-oidc/" + code + "/" + codeVerifier);
                    },
                    
                },
            });
        }
    }

}