using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ChartsController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly string _pythonServiceBaseUrl;

    public ChartsController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _httpClientFactory = httpClientFactory;
        _pythonServiceBaseUrl = configuration.GetValue<string>("PythonService:BaseUrl");
    }

    [HttpGet("{theme}/{chartType}")]
    public async Task<IActionResult> CovidGetChartData(string theme, string chartType)
    {
        // MICROSERVICO PYTHON
        var chartServiceUrl = $"{_pythonServiceBaseUrl}/generate-chart/covid/{theme}/{chartType}";

        var client = _httpClientFactory.CreateClient();

        try
        {
            var response = await client.GetAsync(chartServiceUrl);

            if (response.IsSuccessStatusCode)
            {
                var chartData = await response.Content.ReadAsStringAsync();
                return Content(chartData, "application/json");
            }

            return StatusCode((int)response.StatusCode, "Error fetching data from Python service.");
        }
        catch (HttpRequestException e)
        {
            return StatusCode(503, $"Service unavailable: {e.Message}");
        }
    }


    // TUBERCULOSE
    [HttpGet("tuberculose/{theme}")]
    public async Task<IActionResult> TuberculoseGetChartData(string theme)
    {
        var chartServiceUrl = $"{_pythonServiceBaseUrl}/generate-chart/tuberculose/{theme}";

        var client = _httpClientFactory.CreateClient();

        try
        {
            var response = await client.GetAsync(chartServiceUrl);

            if (response.IsSuccessStatusCode)
            {
                var rawData = await response.Content.ReadAsStringAsync();
                return Content(rawData, "application/json");
            }

            return StatusCode((int)response.StatusCode, "Error fetching data from Python service.");
        }
        catch (HttpRequestException e)
        {
            return StatusCode(503, $"Service unavailable: {e.Message}");
        }
    }

    [HttpPost("llm/explain")]
    public async Task<IActionResult> ExplainData([FromBody] object payload)
    {
        var client = _httpClientFactory.CreateClient();
        var pythonServiceUrl = $"{_pythonServiceBaseUrl}/llm/explain";

        try
        {
            var response = await client.PostAsJsonAsync(pythonServiceUrl, payload);
            response.EnsureSuccessStatusCode();
            var result = await response.Content.ReadAsStringAsync();
            return Content(result, "application/json");
        }
        catch (HttpRequestException e)
        {
            return StatusCode(503, $"Service unavailable: {e.Message}");
        }
    }

}