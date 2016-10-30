## Iran country list of provinces, cities , ... , Tehran Neighbourhood


[Iran Statistic Official WebSite (Markaz Amare Iran)](https://www.amar.org.ir/%D9%81%D8%B1%D8%A7%D8%AF%D8%A7%D8%AF%D9%87%D9%87%D8%A7/%D8%AA%D9%82%D8%B3%DB%8C%D9%85%D8%A7%D8%AA-%DA%A9%D8%B4%D9%88%D8%B1%DB%8C)

the key feature which is just exists in this repository is Finglish names.

you can get cities.sql file and import it in your mysql database.

####   List of Iran provinces (استان) in json format
```php
{
  "RECORDS":[
    {
      "id":1,
      "title":"مرکزی",
      "slug":"Markazi",
      "latitude":33.5093294,
      "longitude":-92.396119
    },
    {
      "id":2,
      "title":"گيلان",
      "slug":"Gilan",
      "latitude":37.2898123,
      "longitude":55.1375834
    },
    {
      "id":2,
      "title":"گيلان",
      "slug":"Gilan",
      "latitude":37.1171617,
      "longitude":49.5279996
    },
    ...
    
    ]
  }

```

#### List of Iran cities(شهرستان) in json format
```php
{
  "RECORDS":[
    {
      "id":1,
      "title":"اراک",
      "slug":"Arak",
      "province_id":1,
      "latitude":34.091667,
      "longitude":49.689167
    },
    {
      "id":2,
      "title":"آشتيان",
      "slug":"Ashtian",
      "province_id":1,
      "latitude":34.521944,
      "longitude":50.006111
    },
    {
      "id":3,
      "title":"تفرش",
      "slug":"Tafresh",
      "province_id":1,
      "latitude":34.691944,
      "longitude":50.013056
    },
    ...
    ]
  }
  
```

#### List of Iran sections (بخش) in json format
```php

{
  "RECORDS":
  [
    {
      "id":"2",
      "title":"مرکزي",
      "slug":"Markazi",
      "city_id":"2"
    },
    {
      "id":"3",
      "title":"ساروق",
      "slug":"Sarough",
      "city_id":"2"
    },
    {
      "id":"4",
      "title":"معصوميه",
      "slug":"Immaculate",
      "city_id":"2"
    },
    {
      "id":"5",
      "title":"کمره",
      "slug":"Camera",
      "city_id":"5"
    },
    ...
    ]
  }
  
```


#### List of Iran towns (دهستان) in json format
```php
{
  "RECORDS":[
    {
      "id":"2",
      "title":"امان آباد",
      "slug":"Amanabad",
      "section_id":"2"
    },
    {
      "id":"3",
      "title":"اميريه",
      "slug":"Amiriyeh",
      "section_id":"2"
    },
    {
      "id":"4",
      "title":"داودآباد",
      "slug":"Davoudabadi",
      "section_id":"2"
    },
    {
      "id":"5",
      "title":"سده",
      "slug":"Century",
      "section_id":"2"
    },
    ...
    ]
  }
  
```


#### List of Tehran neighbourhood (محلات) in json format
```php

{
  "RECORDS" :
  [
       {
          "name":"آرارات, آفتاب",
          "slug":"Ararat, Sunshine",
          "id":1
       },
       {
          "name":"آفریقا, آرامش",
          "slug":"Africa, Aramesh",
          "id":2
       },
       {
          "name":"آرارات, آرارات",
          "slug":"Ararat, Ararat",
          "id":3
       },
       {
          "name":"آفریقا, امین کاج آبادی",
          "slug":"Africa, Amin Kaaj Abadi",
          "id":4
       },
       ...
  ]
}

```
