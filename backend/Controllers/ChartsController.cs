// FUNCIONA COMO UM PROXY (PONTE)

using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ChartsController : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory;

    public ChartsController(IHttpClientFactory httpClientFactory)
    {
        _httpClientFactory = httpClientFactory;
    }

    [HttpGet("{theme}/{chartType}")]
    public async Task<IActionResult> CovidGetChartData(string theme, string chartType)
    {
        // MICROSERVICO PYTHON
        var chartServiceUrl = $"http://localhost:5001/generate-chart/covid/{theme}/{chartType}";

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

    [HttpGet("tuberculose/{theme}")]
    public async Task<IActionResult> TuberculoseGetChartData(string theme)
    {
        var chartServiceUrl = $"http://localhost:5001/generate-chart/tuberculose/{theme}";

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
        var pythonServiceUrl = "http://localhost:5001/llm/explain";

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