using AutoMapper;
using Project1.Dto;
using Project1.Models;

namespace Project1.Helper
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Article, ArticleDto>();
            CreateMap<ArticleDto, Article>();
            CreateMap<Attraction, AttractionDto>();
            CreateMap<AttractionDto, Attraction>();
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();
            CreateMap<UserDto2, User>();
        }
    }
}
