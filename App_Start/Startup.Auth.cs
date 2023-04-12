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

namespace WebApiCore
{
    public partial class Startup
    {
        public static OAuthAuthorizationServerOptions OAuthOptions { get; private set; }

        public static string PublicClientId { get; private set; }
        public static string CurrentHostName = ConfigurationManager.AppSettings["Hostname"];

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
                AccessTokenExpireTimeSpan = TimeSpan.FromDays(60),
                // In production mode set AllowInsecureHttp = false
                AllowInsecureHttp = true
            };

            // Enable the application to use bearer tokens to authenticate users
            app.UseOAuthBearerTokens(OAuthOptions);

            var ggOptions = new GoogleOAuth2AuthenticationOptions()
            {
                ClientId = "1097701043873-s78negds66u6nrcugeh7negike0tr9g9.apps.googleusercontent.com",
                ClientSecret = "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"
            };
            app.UseGoogleAuthentication(ggOptions);

            app.UseOpenIdConnectAuthentication(new OpenIdConnectAuthenticationOptions
            {
                Authority = "https://sso.sempus.vn",
                ClientId = "af1cdc16-33ac-481c-a236-1b7938e70590",
                ClientSecret = "2fkpmDX6CmKB1JcKWdbsUoXIL9grfDAMP2Gzvedc8Ds=",
                RedirectUri = CurrentHostName + "/signin-oidc",
                ResponseType = OpenIdConnectResponseType.Code,
                UsePkce = true,
                Scope = OpenIdConnectScope.OpenIdProfile,
                PostLogoutRedirectUri = CurrentHostName,
                TokenValidationParameters = new TokenValidationParameters { NameClaimType = "name" },
                SaveTokens = true,
                
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

                        // create an HTTP client instance
                        var httpClient = new HttpClient();

                        // create a TokenClientOptions instance with the authorization server configuration
                        var tokenClientOptions = new TokenClientOptions
                        {
                            Address = "https://sso.sempus.vn/connect/token",
                            ClientId = "af1cdc16-33ac-481c-a236-1b7938e70590",
                            ClientSecret = "secret_NamPhong"
                        };

                        // create a new TokenClient instance with the HTTP client and TokenClientOptions
                        var tokenClient = new TokenClient(httpClient, tokenClientOptions);

                        // send the token request and get the response
                        var tokenResponse = await tokenClient.RequestAuthorizationCodeTokenAsync(code, CurrentHostName + "/signin-oidc", "j-qps4W6GrltacvPpBLkJ6CmHiNvQUviIqvqBk19xAY");

                        if (tokenResponse.IsError)
                        {
                            throw new Exception(tokenResponse.Error);
                        }

                    },
                    SecurityTokenValidated = async context =>
                    {
                        var token = context.AuthenticationTicket;
                    },
                    TokenResponseReceived = async context =>
                    {
                        var token = context.Response;
                    },
                    SecurityTokenReceived = async context =>
                    {
                        var token = context.Response;
                    }
                },
            });
        }
    }

}