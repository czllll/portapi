package work.dirtsai.common.common;

import lombok.Data;

import java.util.List;

@Data
public class PageResponse<T> {

    private List<T> records;


    private long total;


    private long current;


    private long size;


    private long pages;

    public PageResponse(List<T> records, long total, long current, long size) {
        this.records = records;
        this.total = total;
        this.current = current;
        this.size = size;
        this.pages = size == 0 ? 0 : (total + size - 1) / size;
    }


    public boolean hasPrevious() {
        return current > 1;
    }

    public boolean hasNext() {
        return current < pages;
    }
}