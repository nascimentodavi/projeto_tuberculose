// FUNCIONA COMO UM PROXY (PONTE)

using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Threading.Tasks;

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
        var pythonServiceUrl = $"http://localhost:5001/generate-chart/covid/{theme}/{chartType}";

        var client = _httpClientFactory.CreateClient();

        try
        {
            // MICROSERVICO PYTHON
            var response = await client.GetAsync(pythonServiceUrl);

            if (response.IsSuccessStatusCode)
            {
                var chartData = await response.Content.ReadAsStringAsync();
                return Content(chartData, "application/json");
            }

            return StatusCode((int)response.StatusCode, "Error fetching data from Python service.");
        }
        catch (HttpRequestException e)
        {
            // Handle cases where the Python service is down
            return StatusCode(503, $"Service unavailable: {e.Message}");
        }
    }
}