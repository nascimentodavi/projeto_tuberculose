var builder = WebApplication.CreateBuilder(args);

// PERMITE CRIACAO DE CONTROLLERS
builder.Services.AddControllers();

// DOCUMENTA APIS AUTOMATICAMENTE COM PADRAO OPENAPI (Swagger)
builder.Services.AddOpenApi();

// PERMITE QUE MINHA APLICACAO FACA REQUISICOES HTTP PARA APIS OU SERVICOS
builder.Services.AddHttpClient();

// CONFIGURA POLITICA DE CORS => CROSS ORIGIN RESOURCE SHARING, PERMITINDO QUE UMA APLICACAO WEB RODANDO NA PORTA 3000 POSSA FAZER REQUISICOES PARA MINHA API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder.WithOrigins("http://localhost:5173")
                            .AllowAnyHeader()
                            .AllowAnyMethod());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors("AllowReactApp");

app.Run();
