from django.http import JsonResponse
from pymongo import MongoClient
from collections import defaultdict
from django.http import JsonResponse

client = MongoClient('mongodb://localhost:27017/')
db = client['dashboard-assignment']
collection = db['data']

def group_into_continents(region):
    if region in ['Northern America', 'Central America', 'Caribbean', 'South America', 'Americas']:
        return 'Americas'
    elif region in ['Northern Europe', 'Western Europe', 'Southern Europe', 'Eastern Europe', 'Europe']:
        return 'Europe'
    elif region in ['Northern Africa', 'Western Africa', 'Southern Africa', 'Eastern Africa', 'Middle Africa', 'Africa']:
        return 'Africa'
    elif region in ['Australia and New Zealand', 'Melanesia', 'Micronesia', 'Polynesia', 'Oceania']:
        return 'Oceania'
    elif region in ['Central Asia', 'Eastern Asia', 'South-Eastern Asia', 'Southern Asia', 'Western Asia', 'Asia']:
        return 'Asia'
    else:
        return 'Others'


def barchart(request):
    selected_year = request.GET.get('year')
    query = {}
    if selected_year:
        selected_year = selected_year[:4]
        query['start_year'] = int(selected_year) 
    data = collection.find(query, {'_id': False})

    continent_relevance = {
        'Americas': 0,
        'Europe': 0,
        'Africa': 0,
        'Oceania': 0,
        'Asia': 0,
        'Others': 0,
    }
    continent_likelihood ={
        'Americas': 0,
        'Europe': 0,
        'Africa': 0,
        'Oceania': 0,
        'Asia': 0,
        'Others': 0,
    }

    for item in data:
        region = item.get('region', '')
        relevance = item.get('relevance', 0)
        likelihood = item.get('likelihood', 0)

        try:
            relevance = float(relevance)  
            likelihood = float(likelihood)
        except (ValueError, TypeError):
            relevance = 0  
            likelihood = 0 
        continent = group_into_continents(region)
        continent_relevance[continent] += relevance
        continent_likelihood[continent] += likelihood
        
    regions = list(continent_relevance.keys())
    relevance = list(continent_relevance.values())
    likelihood = list(continent_likelihood.values())    
    return JsonResponse({"region": regions, "relevance": relevance,"likelihood":likelihood}, safe=False)




def linechart(request):
    sector = request.GET.get('sector', '')
    query = {'intensity': {'$exists': True}, 'end_year': {'$exists': True}}
    if sector:
        query['sector'] = sector  
    data = list(collection.find(query))
    year_intensity = defaultdict(list)
    for item in data:
        end_year = item.get('end_year', '')
        intensity = item.get('intensity', 0)
        if not end_year:
            continue
        try:
            end_year = int(end_year)
            intensity = int(intensity)
        except (ValueError, TypeError):
            continue
        year_intensity[end_year].append(intensity)

    result = {year: sum(intensities) / len(intensities) for year, intensities in year_intensity.items() if intensities}
    sorted_result = dict(sorted(result.items()))
    return JsonResponse({"years": list(sorted_result.keys()), "intensity": list(sorted_result.values())}, safe=False)


def radarplot(request):
    topic = request.GET.get('topic', 'oil').lower()
    data = list(collection.find({'topic': topic}, {'_id': False}))

    continent_relevance = defaultdict(list)
    for item in data:
        region = item.get('region', 'Unknown')  
        relevance = item.get('relevance', 0)
        if isinstance(relevance, (int, float)):  
            continent_relevance[region].append(relevance)

    result = {continent: (sum(values) / len(values)) for continent, values in continent_relevance.items() if values}

    response_data = {
        'labels': list(result.keys()),  
        'datasets': [
            {
                'label': topic,  
                'data': list(result.values()),
                'backgroundColor': 'rgba(75, 192, 192, 0.2)',
                'borderColor': 'rgba(75, 192, 192, 1)',
                'borderWidth': 2,
            },
        ],
    }

    return JsonResponse(response_data)