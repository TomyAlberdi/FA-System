package com.example.febackendproject.Service;

import com.example.febackendproject.Entity.Tag;
import com.example.febackendproject.Repository.TagRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class TagService {
    
    private final TagRepository tagRepository;
    
    public List<String> listKeys() {
        return tagRepository.listKeys();
    }
    
    public List<String> listValuesByKey(String key) {
        return tagRepository.listValuesByKey(key);
    }
    
    public List<Tag> listAll() {
        return tagRepository.findAll();
    }
    
    public Boolean existsByValue(String value) {
        return tagRepository.existsByValue(value);
    }
    
    public Boolean existsByKey(String key) {
        return tagRepository.existsByKey(key);
    }
    
    public Optional<Tag> addTag(String key, String value) {
        if ((tagRepository.existsByKey(key)) && (tagRepository.existsByValue(value))) {
            return tagRepository.find(key, value);
        }
        Tag newTag = new Tag();
        newTag.setTagKey(key);
        newTag.setValue(value);
        tagRepository.save(newTag);
        return Optional.of(newTag);
    }
    
    public List<Long> filterUniqueTagKeys(List<Tag> tags) {
        Set<String> seenKeys = new HashSet<>();
        return tags.stream()
                .filter(tag -> seenKeys.add(tag.getTagKey()))
                .map(Tag::getId)
                .collect(Collectors.toList());
    }
    
}